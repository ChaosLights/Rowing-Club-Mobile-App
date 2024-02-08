import 'package:flutter/material.dart';
// import 'home.dart';

class SecondHome extends StatelessWidget{
  const SecondHome({super.key});

  @override
  Widget build(BuildContext context) {
    return  Scaffold (
      appBar: AppBar(  
          title: const Text("Secondary Page")  
      ),
      body: Center(
        child: Column (
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('More Information Incoming...'),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Back'),
            ),
          ]
        ),
      )
    );
  }
}