package main

import (
	"fmt"
	"encoding/json"

	ImageKit "github.com/imagekit-developer/imagekit-go"
	"github.com/imagekit-developer/imagekit-go/api/uploader"
)

// ImageKit client
type ImgKit struct {
	client    *ImageKit.ImageKit
	clientErr bool
}

// Initialize ImageKit client
func InitImageKit(imgKit *ImgKit) {
	var imageKitErr error
	imgKit.client, imageKitErr = ImageKit.New()

	if imageKitErr != nil {
		fmt.Printf("Error with initializing ImageKit client: %v\n", imageKitErr)
		imgKit.clientErr = true
	}
	fmt.Println("ImageKit available for use")
}

func (imgKit *ImgKit) uploadImage(a *App, id string) (imageUrl string, err error) {
	resp, uploadErr := imgKit.client.Uploader.Upload(a.ctx, a.bookmark.imgBase64, uploader.UploadParam{
		Folder:   "Bookmarks",
		FileName: id,
	})
	if uploadErr != nil {
		return "", uploadErr
	}

	var imageInfo uploadedImageRes
	unmarshalErr := json.Unmarshal(resp.Body(), &imageInfo)
	if unmarshalErr != nil {
		fmt.Printf("Error with unmarshalling json: %v\n", err)
		return "", unmarshalErr
	}

	fmt.Printf("Image upload result:%v+\n", imageInfo)
	return imageInfo.Url, nil
}