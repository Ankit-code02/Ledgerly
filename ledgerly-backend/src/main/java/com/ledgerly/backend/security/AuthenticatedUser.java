package com.ledgerly.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class AuthenticatedUser {

    private AuthenticatedUser() {
    }

    public static Long getId() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getDetails() == null) {
            throw new IllegalStateException("User is not authenticated");
        }

        return (Long) authentication.getDetails();
    }
}
