import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

@override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Rowing App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Color.fromARGB(255, 76, 134, 175)),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Rowing App'),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(title),
      ),
      body: Center(
        child: Image(
          image: AssetImage('images/rowing.jpg'),
        ),
      ),
      floatingActionButton: ElevatedButton(
        onPressed: () {
          // Button pressed action
          print('Add an image');
        },
        child: Text('+'),
      ),
    );
  }
}