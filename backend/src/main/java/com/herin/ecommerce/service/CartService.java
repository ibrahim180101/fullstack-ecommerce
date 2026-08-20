package com.herin.ecommerce.service;

import com.herin.ecommerce.dto.CartDTO.CartRequestDTO;
import com.herin.ecommerce.dto.CartDTO.CartResponseDTO;
import com.herin.ecommerce.dto.CartDTO.QuantityUpdateRequest;
import com.herin.ecommerce.exception.BadRequestException;
import com.herin.ecommerce.mapper.CartMapper;
import com.herin.ecommerce.model.CartItemEntity;
import com.herin.ecommerce.model.ProductEntity;
import com.herin.ecommerce.model.UserEntity;
import com.herin.ecommerce.repository.CartItemRepository;
import com.herin.ecommerce.repository.ProductRepository;
import com.herin.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartMapper cartMapper;

    @Autowired
    public CartService(
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            CartMapper cartMapper) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.cartMapper = cartMapper;
    }

    @Transactional(readOnly = true)
    public List<CartResponseDTO> getCartItemsByUserId(Long userId) {
        getUserOrThrow(userId);
        return cartItemRepository.findByUserId(userId)
                .stream()
                .map(cartMapper::mapToDTO)
                .toList();
    }

    @Transactional
    public CartResponseDTO addCartItem(long userId, CartRequestDTO request) {
        if (request == null || request.getProductId() == null) {
            throw new BadRequestException("Product ID is required");
        }

        int requestedQty = Math.max(request.getQuantity(), 1);
        ProductEntity product = getProductOrThrow(request.getProductId());
        UserEntity user = getUserOrThrow(userId);

        CartItemEntity item = cartItemRepository
                .findByUserIdAndProductId(userId, product.getId())
                .orElseGet(CartItemEntity::new);

        int newQuantity = item.getId() == null
                ? requestedQty
                : item.getQuantity() + requestedQty;

        if (product.getQuantity() < newQuantity) {
            throw new BadRequestException("Not enough product in stock");
        }

        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(newQuantity);

        return cartMapper.mapToDTO(cartItemRepository.save(item));
    }

    @Transactional
    public void deleteCartItem(long userId, long cartItemId) {
        CartItemEntity item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new BadRequestException("Cart item not found"));

        if (item.getUser() == null || !item.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        cartItemRepository.delete(item);
    }

    @Transactional
    public CartResponseDTO patchCartItemQty(
            long userId,
            Long cartItemId,
            QuantityUpdateRequest request) {

        if (request == null) {
            throw new BadRequestException("Quantity is required");
        }

        CartItemEntity item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new BadRequestException("Cart item not found"));

        if (item.getUser() == null || !item.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        int requestedQty = Math.max(request.getQuantity(), 1);
        ProductEntity product = item.getProduct();

        if (product == null) {
            throw new BadRequestException("Product not found for cart item");
        }

        if (product.getQuantity() < requestedQty) {
            throw new BadRequestException("Not enough product in stock");
        }

        item.setQuantity(requestedQty);
        return cartMapper.mapToDTO(cartItemRepository.save(item));
    }

    private ProductEntity getProductOrThrow(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new BadRequestException("Product not found"));
    }

    private UserEntity getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found. Please login again."));
    }
}
