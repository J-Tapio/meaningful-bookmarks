package main

import (
	"fmt"

	"golang.design/x/clipboard"
)

// Initializes clipboard package. Initialization error with package means that within app the url has to be manually inserted.
func InitClipboard(a *App) {
	err := clipboard.Init()
	if err != nil {
		fmt.Printf("Error with initializing clipboard: %v", err)
		a.clipboardInitErr = true
	} else {
		a.clipboardInitErr = false
		fmt.Printf("Clipboard available for use")
	}
}


