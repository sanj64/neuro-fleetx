package com.neurofleet.backend.controller;

import com.neurofleet.backend.model.User;
import com.neurofleet.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        if (user.getName() == null || user.getEmail() == null ||
            user.getPassword() == null || user.getRole() == null) {
            return ResponseEntity.badRequest().body("All fields are required!");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(409).body("Email already registered!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.status(201).body("Signup Successful");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginUser) {

        return userRepository.findByEmail(loginUser.getEmail())
                .map(user -> {
                    if (!passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
                        return ResponseEntity.status(401).body("Invalid Credentials");
                    }
                    if (!user.getRole().equalsIgnoreCase(loginUser.getRole())) {
                        return ResponseEntity.status(401).body("Invalid Role");
                    }
                    return ResponseEntity.ok("Login Successful");
                })
                .orElse(ResponseEntity.status(404).body("User not found"));
    }
}