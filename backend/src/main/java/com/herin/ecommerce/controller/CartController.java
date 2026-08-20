package com.herin.ecommerce.controller;

import com.herin.ecommerce.dto.CartDTO.CartRequestDTO;
import com.herin.ecommerce.dto.CartDTO.CartResponseDTO;
import com.herin.ecommerce.dto.CartDTO.QuantityUpdateRequest;
import com.herin.ecommerce.model.UserPrincipal;
import com.herin.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<CartResponseDTO>> getCartItems(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(cartService.getCartItemsByUserId(userPrincipal.getUser().getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponseDTO> addCartItems(
            @RequestBody CartRequestDTO cartRequestDTO,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        long userId = userPrincipal.getUser().getId();
        return ResponseEntity.ok(cartService.addCartItem(userId, cartRequestDTO));
    }

    @PatchMapping("/{cartItemId}")
    public ResponseEntity<CartResponseDTO> patchCartItemsQty(
            @PathVariable Long cartItemId,
            @RequestBody QuantityUpdateRequest quantityUpdateRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        long userId = userPrincipal.getUser().getId();
        return ResponseEntity.ok(cartService.patchCartItemQty(userId, cartItemId, quantityUpdateRequest));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> deleteCartItems(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        long userId = userPrincipal.getUser().getId();
        cartService.deleteCartItem(userId, cartItemId);
        return ResponseEntity.ok("Item deleted from cart");
    }
}
