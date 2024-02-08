import 'dart:io';

import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:image_picker/image_picker.dart';
import 'package:firebase_storage/firebase_storage.dart';

class ImageFirebase extends StatefulWidget {
  const ImageFirebase({Key? key}) : super(key: key);
  
  @override
  State<ImageFirebase> createState() => _ImageFirebaseState();
}

class _ImageFirebaseState  extends State<ImageFirebase> {
  final recordCcontroller = TextEditingController();

  GlobalKey<FormState> key = GlobalKey();

  String imageUrl = '';

  @override
  Widget build(BuildContext context) {
    return  Scaffold (
      appBar: AppBar(  
          title: const Text("Record Training")  
      ),
      body: Padding(
        padding: const EdgeInsets.all(25),
        child: Form(
          // key: key,
          child: Column (
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                controller: recordCcontroller,
                decoration:
                    InputDecoration(hintText: 'Enter training result'),
              ),
              Row(
                children: [
                  //image from camera
                  IconButton(
                    onPressed: () async {
                      //get image
                      ImagePicker imagePicker = ImagePicker();
                      XFile? file = await imagePicker.pickImage(source: ImageSource.camera);
                      String imageName = DateTime.now().millisecondsSinceEpoch.toString();
                      //check not null
                      if (file == null) return;
                      //get file ready to upload
                      Reference referenceRoot = FirebaseStorage.instance.ref();
                      Reference referenceDirImages = referenceRoot.child('images');
                      Reference referenceImageToUpload = referenceDirImages.child(imageName);
                      //upload to firebase
                      try {
                        await referenceImageToUpload.putFile(File(file!.path));
                        //success: get the download URL
                        imageUrl = await referenceImageToUpload.getDownloadURL();
                      } catch (error) {
                        //error: print error message
                        print("Error uploading image: $error");
                      }
                    },
                    icon: Icon(Icons.camera_alt),
                  ),
                  //image from gallery
                  IconButton(
                    onPressed: () async {
                      //get image
                      ImagePicker imagePicker = ImagePicker();
                      XFile? file = await imagePicker.pickImage(source: ImageSource.gallery);
                      String imageName = DateTime.now().millisecondsSinceEpoch.toString();
                      //check not null
                      if (file == null) return;
                      //get file ready to upload
                      Reference referenceRoot = FirebaseStorage.instance.ref();
                      Reference referenceDirImages = referenceRoot.child('images');
                      Reference referenceImageToUpload = referenceDirImages.child(imageName);
                      //upload to firebase
                      try {
                        await referenceImageToUpload.putFile(File(file!.path));
                        //success: get the download URL
                        imageUrl = await referenceImageToUpload.getDownloadURL();
                      } catch (error) {
                        //error: print error message
                        print("Error uploading image: $error");
                      }
                    },
                    icon: Icon(Icons.image),
                  ),
                ],
              ),
              
                
              ElevatedButton(
                onPressed: () async {

                },
                child: const Text('upload'),
                // onPressed: () async {
                //   if (imageUrl.isEmpty) {
                // CollectionReference collRef = FirebaseFirestore.instance.collection('collectionPath')
              ),
            ],
          ),
        ),
      )
    );
  }
}