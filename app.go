package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.design/x/clipboard"
)

// App struct
type App struct {
	ctx              context.Context
	clipboardInitErr bool
	envLoadErr       bool
	bookmark         BookMark
}

// Bookmark struct - When saving a bookmark
type BookMark struct {
	imgBase64 string
	PageURL   string `json:"pageURL"`
	ImageURL  string `json:"imageURL"`
}

// Data emitted from frontend when saving a bookmark
type NoteAndTags struct {
	Title string   `json:"title"`
	Note  string   `json:"note"`
	Tags  []string `json:"tags"`
}

// Imagekit response from image upload
type uploadedImageRes struct {
	Url          string `json:"url"`
	ThumbnailUrl string `json:"thumbnailUrl"`
}

/*
Referencing: https://stackoverflow.com/questions/70589570/how-i-insert-a-time-date-stamp-in-mongodb-with-a-golang-sruct

Using unix epoch to handle timestamps
*/
type NoteDocument struct {
	ID        string   `bson:"_id" json:"id"`
	Title     string   `bson:"noteTitle" json:"noteTitle"`
	PageURL   string   `bson:"pageURL" json:"pageURL"`
	ImageURL  string   `bson:"imageURL" json:"imageURL"`
	Note      []byte   `bson:"note" json:"note"`
	Tags      []string `bson:"tags" json:"tags"`
	CreatedAt int64    `bson:"created_at" json:"created_at"`
	UpdatedAt int64    `bson:"updated_at" json:"updated_at"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) domready(ctx context.Context) {
	if !a.clipboardInitErr {
		a.clipboardUrl(ctx)
	} else {
		runtime.EventsEmit(ctx, "clipboard not available")
	}

	runtime.EventsOn(ctx, "bookmark", a.saveBookMark)
}

func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	dialog, err := runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
		Type:    runtime.QuestionDialog,
		Title:   "Quit?",
		Message: "Are you sure you want to quit?",
	})

	if err != nil {
		return false
	}
	return dialog != "Yes"
}

// Loads local .env file. Env variables for Mongo, screenshotOne and ImageKit.
func LoadEnvFile(a *App) {
	err := godotenv.Load()
	if err != nil {
		fmt.Printf("Error with loading .env file: %v\n", err)
		a.envLoadErr = true
	} else {
		a.envLoadErr = false
	}
}

// If url copied to clipboard. Does not call generateScreenshot if copied url not new than retained url within memory.
func (a *App) clipboardUrl(ctx context.Context) {
	go func() {
		for {
			clipboardString := string(clipboard.Read(clipboard.FmtText))
			currentURL, err := url.ParseRequestURI(clipboardString)

			if err == nil && a.bookmark.PageURL != currentURL.String() && strings.Contains(currentURL.String(), "http") {
				a.bookmark.PageURL = currentURL.String()
				//a.retainedURL = currentURL.String()

				fmt.Printf("Currently copied URL: %s\n", a.bookmark.PageURL)
				runtime.EventsEmit(ctx, "url", a.bookmark.PageURL)
				if !screenshot.clientErr {
					screenshot.generateScreenshot(a)
				}
			}
			time.Sleep(1 * time.Second)
		}
	}()
}

func (a *App) saveBookMark(data ...interface{}) {
	// Only one argument is passed to the function when event emitted
	var note NoteAndTags
	//Convert map[string]interface {} to string
	jsonStr, marshalErr := json.Marshal(data[0])
	if marshalErr != nil {
		fmt.Printf("Error while converting to json: %s\n", marshalErr)
		runtime.EventsEmit(a.ctx, "Provided data could not be turned into json")
		return
	}

	unmarshalErr := json.Unmarshal(jsonStr, &note)
	if unmarshalErr != nil {
		runtime.EventsEmit(a.ctx, "Error with formatting json string to struct")
		return
	}

	// Insert document to database - without image url
	id, insertErr := db.insertNote(a, NoteDocument{
		PageURL:  a.bookmark.PageURL,
		ImageURL: "",
		Title:    note.Title,
		Note:     []byte(note.Note),
		Tags:     note.Tags,
	})

	if insertErr != nil {
		fmt.Printf("Document upload failed: %s\n", insertErr)
		runtime.EventsEmit(a.ctx, "Document upload failed")
		return
	}

	// Upload the image
	imageUrl, imgUploadErr := imgKit.uploadImage(a, id.String())

	if imgUploadErr != nil {
		// If upload fails - do not update document. Handle within frontend unavailable image by providing backup image from predefined source
		fmt.Printf("Image upload failed: %v\n", imgUploadErr)
		// In overall - ignore image.
		runtime.EventsEmit(a.ctx, "Document uploaded without image")
		return
	}
	// Upsert document info within Mongo database with image url information
	updateErr := db.upsertNoteImg(a, id, imageUrl)

	if updateErr != nil {
		//! Consider later how to handle if upload failed just because of unknown id
		fmt.Printf("Document update with image url failed: %s\n", updateErr)
		// In overall - ignore image, use backup image within frontend when viewing old bookmarks.
		runtime.EventsEmit(a.ctx, "Document uploaded without image")
		return
	}

	runtime.EventsEmit(a.ctx, "Document uploaded successfully")
	//? Better to re-initialize as empty struct of type Bookmark?
	//? How to 're-initialize' with nil values? This seems stupid way to go?
	a.bookmark = BookMark{imgBase64: "", PageURL: "", ImageURL: ""}
	fmt.Println("Document uploaded successfully")
}

// Frontend go-bindings
func (a *App) AllBookmarks() ([]NoteDocument, error) {
	return db.allBookmarks(a)
}

func (a *App) BookmarkById(id string) (*NoteDocument, error) {
	return db.bookmarkById(a, id)
}
