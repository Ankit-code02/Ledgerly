package com.ledgerly.backend.controller;

import com.ledgerly.backend.dto.UserRegistrationRequest;
import com.ledgerly.backend.dto.UserResponse;
import com.ledgerly.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.ledgerly.backend.dto.LoginRequest;
import com.ledgerly.backend.dto.LoginResponse;
import com.ledgerly.backend.security.AuthenticatedUser;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(
            @Valid @RequestBody UserRegistrationRequest request
    ) {
        return userService.register(request);
    }
    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return userService.login(request);
    }
    @GetMapping("/me")
    public UserResponse getCurrentUser() {

        Long userId = AuthenticatedUser.getId();

        return userService.getCurrentUser(userId);
    }
}
