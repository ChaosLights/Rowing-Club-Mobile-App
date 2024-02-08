import 'package:flutter/material.dart';

class TTextTheme {
  TTextTheme._();

  static TextTheme lightTextTheme = TextTheme(
    headlineLarge: const TextStyle().copyWith(fontSize: 36, fontWeight: FontWeight.bold, color: const Color.fromARGB(255, 176, 39, 24)),
    headlineMedium: const TextStyle().copyWith(fontSize: 24, fontWeight: FontWeight.w600, color: const Color.fromARGB(255, 176, 39, 24)),
    headlineSmall: const TextStyle().copyWith(fontSize: 18, fontWeight: FontWeight.w600, color: const Color.fromARGB(255, 176, 39, 24)),

    titleLarge: const TextStyle(fontSize: 16, color: Color.fromARGB(255, 176, 39, 24)),
    titleMedium: const TextStyle(fontSize: 16, color: Color.fromARGB(255, 176, 39, 24)),
    titleSmall: const TextStyle(fontSize: 16, color: Color.fromARGB(255, 176, 39, 24)),

    bodyLarge: const TextStyle(fontSize: 14, color: Color.fromARGB(255, 63, 63, 69)),
    bodyMedium: const TextStyle(fontSize: 14, color: Color.fromARGB(255, 63, 63, 69)),
    bodySmall: const TextStyle(fontSize: 14, color: Color.fromARGB(255, 63, 63, 69)),

    labelLarge: const TextStyle(fontSize: 12, color: Color.fromARGB(255, 8, 7, 63)),
    labelMedium: const TextStyle(fontSize: 12, color: Color.fromARGB(255, 8, 7, 63)),
    labelSmall: const TextStyle(fontSize: 12, color: Color.fromARGB(255, 8, 7, 63)),
  );
  
  static TextTheme darkTextTheme = TextTheme(
    headlineLarge: const TextStyle().copyWith(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white),
    headlineMedium: const TextStyle().copyWith(fontSize: 24, fontWeight: FontWeight.w600, color: Colors.white),
    headlineSmall: const TextStyle().copyWith(fontSize: 18, fontWeight: FontWeight.w600, color: Colors.white),

    titleLarge: const TextStyle(fontSize: 16, color: Colors.white),
    titleMedium: const TextStyle(fontSize: 16, color: Colors.white),
    titleSmall: const TextStyle(fontSize: 16, color: Colors.white),

    bodyLarge: const TextStyle(fontSize: 14, color: Colors.white),
    bodyMedium: const TextStyle(fontSize: 14, color: Colors.white),
    bodySmall: const TextStyle(fontSize: 14, color: Colors.white),

    labelLarge: const TextStyle(fontSize: 12, color: Colors.white),
    labelMedium: const TextStyle(fontSize: 12, color: Colors.white),
    labelSmall: const TextStyle(fontSize: 12, color: Colors.white),
  );
}