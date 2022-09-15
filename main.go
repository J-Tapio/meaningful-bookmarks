package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed frontend/dist
var assets embed.FS

// Database - Mongo
var db MongoDb

// ScreenshotOne - Screenshot of page
var screenshot ScreenshotOne

// ImageKit - Image uploads
var imgKit ImgKit

func main() {
	// Create an instance of the app structure
	app := NewApp()

	LoadEnvFile(app)
	// Initialize MongoDb client and collection to use
	InitDb(&db)
	// Initialize clipboard package
	InitClipboard(app)
	// Initialize ScreenshotOne client
	InitScreenshotOne(&screenshot)
	// Initialize ImageKit client
	InitImageKit(&imgKit)

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "Meaningful Bookmarks",
		Width:            1024,
		Height:           768,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		OnDomReady:       app.domready,
		OnBeforeClose:    app.beforeClose,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
