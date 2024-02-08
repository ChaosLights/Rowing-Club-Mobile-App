import 'package:flutter/material.dart';
import 'secondhome.dart';

class Home extends StatelessWidget{
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return  Scaffold (
      appBar: AppBar(  
          title: const Text("Home Page")  
      ),
      body: Center(
        child: Column (
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Welcome to the Rowing Club and Union App'),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const SecondHome()),
                );
              },
              child: const Text('More'),
            ),
          ]
        ),
      )
    );
  }
}