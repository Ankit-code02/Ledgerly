package com.ledgerly.backend.dto;

public record LoginResponse(
        String token,
        Long userId,
        String name,
        String email
) {
}