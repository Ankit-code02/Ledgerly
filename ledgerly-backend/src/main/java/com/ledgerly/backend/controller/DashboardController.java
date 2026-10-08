package com.ledgerly.backend.controller;

import com.ledgerly.backend.dto.DashboardResponse;
import com.ledgerly.backend.security.AuthenticatedUser;
import com.ledgerly.backend.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse getDashboard() {
        Long userId = AuthenticatedUser.getId();
        return dashboardService.getDashboard(userId);
    }
}