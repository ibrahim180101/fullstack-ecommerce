package com.herin.ecommerce.controller;

import com.herin.ecommerce.dto.StripeRequestDTO;
import com.herin.ecommerce.model.OrderEntity;
import com.herin.ecommerce.repository.UserRepository;
import com.herin.ecommerce.service.JWTService;
import com.herin.ecommerce.service.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/stripe")
public class StripeController {
    private final StripeService stripeService;
    private final JWTService jwtService;
    private final UserRepository userRepository;

    @Autowired
    public StripeController(
            StripeService stripeService,
            JWTService jwtService,
            UserRepository userRepository
    ) {
        this.stripeService = stripeService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(
            @RequestBody StripeRequestDTO stripeRequestDTO,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        try {
            Long userId = getUserIdFromAuthorization(authorization);

            List<String> productNames = stripeRequestDTO.getProductNames();
            List<Long> pricesInCents = stripeRequestDTO.getPricesInCents();
            List<Long> quantities = stripeRequestDTO.getQuantities();
            String successUrl = stripeRequestDTO.getSuccessUrl();
            String cancelUrl = stripeRequestDTO.getCancelUrl();

            String checkoutUrl = stripeService.createCheckoutSession(
                    productNames,
                    pricesInCents,
                    quantities,
                    successUrl,
                    cancelUrl,
                    userId
            );

            return ResponseEntity.ok(Collections.singletonMap("url", checkoutUrl));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/complete-order")
    public ResponseEntity<?> completeOrder(
            @RequestParam String sessionId,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        try {
            Long authenticatedUserId = getUserIdFromAuthorization(authorization);

            OrderEntity order = stripeService.completeOrder(sessionId);

            if (!order.getUser().getId().equals(authenticatedUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Collections.singletonMap("error", "Order does not belong to the authenticated user."));
            }

            return ResponseEntity.ok(Map.of(
                    "success", "true",
                    "orderId", String.valueOf(order.getId()),
                    "status", order.getStatus(),
                    "totalAmount", order.getTotalAmount().toString()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    private Long getUserIdFromAuthorization(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authentication token is required.");
        }

        String token = authorization.substring(7);
        String username = jwtService.extractUserName(token);

        return userRepository.findByUsername(username)
                .filter(com.herin.ecommerce.model.UserEntity.class::isInstance)
                .map(com.herin.ecommerce.model.UserEntity.class::cast)
                .map(com.herin.ecommerce.model.UserEntity::getId)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found."));
    }
}
