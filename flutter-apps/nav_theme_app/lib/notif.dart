import 'package:flutter/material.dart';

class Notif extends StatelessWidget{
  const Notif({super.key});

  @override
  Widget build(BuildContext context) {
    return  Scaffold (
      appBar: AppBar(  
          title: const Text("Notification")  
      ),
      body: const Center(
        child: Padding (
          padding: EdgeInsets.all(8.0),
          child: Column(
            children: <Widget>[
              Card(
                child: ListTile(
                  leading: Icon(Icons.notifications_sharp),
                  title: Text('Training time'),
                  subtitle: Text('Please ensure to checkin your attendance with the coahces.'),
                ),
              ),
              Card(
                child: ListTile(
                  leading: Icon(Icons.notifications_sharp),
                  title: Text('First Competition'),
                  subtitle: Text('Everyone who can attend the competition must sign up before Thursday!'),
                ),
              ),
            ],
          ),
        ),
      )
    );
  }
}