package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"

	screenshots "github.com/screenshotone/gosdk"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// ScreenshotOne client
type ScreenshotOne struct {
	client    *screenshots.Client
	clientErr bool
}

// Initialize ScreenshotOne client. Error with client means that it is not possible to save image for bookmark.
func InitScreenshotOne(screenshot *ScreenshotOne) {
	accessKey := os.Getenv("SCRNSHOTONE_ACCESS_KEY")
	signedKey := os.Getenv("SCRNSHOTONE_SIGNED_KEY")
	var clientErr error
	screenshot.client, clientErr = screenshots.NewClient(accessKey, signedKey)
	if clientErr != nil {
		screenshot.clientErr = true
	} else {
		screenshot.clientErr = false
		fmt.Println("ScreenshotOne available for use")
	}
}

func (screenshot *ScreenshotOne) generateScreenshot(a *App) {
	options := screenshots.NewTakeOptions(a.bookmark.PageURL).
		Format("webp").
		ViewportHeight(500).
		DeviceScaleFactor(1).
		BlockAds(true).
		BlockTrackers(true).
		Cache(true)

	// To  check what is the generated url for ScreenshotOne
	// generatedURL, _ := a.screenshotClient.GenerateTakeURL(options)
	// fmt.Printf("Generated url: %s\n", generatedURL.String())

	image, _, screenshotErr := screenshot.client.Take(context.TODO(), options)
	if screenshotErr != nil {
		fmt.Printf("Error with image load: %v\n", screenshotErr)
		runtime.EventsEmit(a.ctx, "screenshotErr")
	}

	imgBase64 := base64.StdEncoding.EncodeToString(image)
	a.bookmark.imgBase64 = fmt.Sprintf("data:image/webp;base64,%s", imgBase64)
	// Save the base64 data - used if bookmark eventually save.
	runtime.EventsEmit(a.ctx, "screenshotImg", a.bookmark.imgBase64)
}