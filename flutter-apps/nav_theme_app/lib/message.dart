import 'package:flutter/material.dart';

class Message extends StatelessWidget{
  const Message({super.key});

  @override
  Widget build(BuildContext context) {
    return  Scaffold (
      appBar: AppBar(  
          title: const Text("Messages")  
      ),
      body: const Center(
        child: Padding (
          padding: EdgeInsets.all(8.0),
          child: ListTile(
              leading: Icon(Icons.message),
              title: Text('No messages yet...'),
          ),
        ),
      )
    );
  }
}