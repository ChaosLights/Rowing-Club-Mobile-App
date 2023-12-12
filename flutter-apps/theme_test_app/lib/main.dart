import 'package:flutter/material.dart';
import 'package:test/theme/theme.dart';

void main() {
  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});
  final appName = 'TEST';

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: appName,
      themeMode: ThemeMode.system,
      theme: TAppTheme.lightTheme,
      darkTheme: TAppTheme.darkTheme,
      home: HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Theme Demo'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Welcome to Theme Demo!',
              style: Theme.of(context).textTheme.headline5,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Add your button press logic here
                print('Button Pressed!');
              },
              child: Text('Press Me'),
            ),
          ],
        ),
      ),
    );
  }
}



