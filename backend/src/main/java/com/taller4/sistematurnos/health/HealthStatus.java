package com.taller4.sistematurnos.health;

import java.time.Instant;

public record HealthStatus(String status, Instant timestamp) {
}
