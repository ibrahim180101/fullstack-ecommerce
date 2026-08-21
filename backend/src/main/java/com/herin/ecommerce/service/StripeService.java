package com.herin.ecommerce.service;

import com.herin.ecommerce.model.CartItemEntity;
import com.herin.ecommerce.model.OrderEntity;
import com.herin.ecommerce.model.OrderItemEntity;
import com.herin.ecommerce.model.UserEntity;
import com.herin.ecommerce.repository.CartItemRepository;
import com.herin.ecommerce.repository.OrderItemRepository;
import com.herin.ecommerce.repository.OrderRepository;
import com.herin.ecommerce.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class StripeService {
    @Value("${stripe.secret.key}")
    private String stripeApiKey;

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public StripeService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public String createCheckoutSession(
            List<String> productNames,
            List<Long> pricesInCents,
            List<Long> quantities,
            String successUrl,
            String cancelUrl,
            Long userId
    ) throws Exception {
        if (productNames == null || productNames.isEmpty() || pricesInCents == null || pricesInCents.isEmpty()) {
            throw new IllegalArgumentException("Product names and prices must not be empty.");
        }
        if (productNames.size() != pricesInCents.size() || productNames.size() != quantities.size()) {
            throw new IllegalArgumentException("Product names, prices and quantities must have the same number of items.");
        }

        SessionCreateParams.Builder builder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(cancelUrl)
                .setClientReferenceId(String.valueOf(userId));

        for (int i = 0; i < productNames.size(); i++) {
            SessionCreateParams.LineItem.PriceData.ProductData productData =
                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName(productNames.get(i))
                            .build();

            SessionCreateParams.LineItem.PriceData priceData =
                    SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("cad")
                            .setUnitAmount(pricesInCents.get(i))
                            .setProductData(productData)
                            .build();

            SessionCreateParams.LineItem lineItem =
                    SessionCreateParams.LineItem.builder()
                            .setPriceData(priceData)
                            .setQuantity(quantities.get(i))
                            .build();

            builder.addLineItem(lineItem);
        }

        Session session = Session.create(builder.build());
        return session.getUrl();
    }

    @Transactional
    public OrderEntity completeOrder(String sessionId) throws Exception {
        if (sessionId == null || sessionId.isBlank()) {
            throw new IllegalArgumentException("Stripe session ID is required.");
        }

        OrderEntity existingOrder = orderRepository.findByStripeSessionId(sessionId).orElse(null);
        if (existingOrder != null) {
            return existingOrder;
        }

        Session session = Session.retrieve(sessionId);

        if (!"paid".equalsIgnoreCase(session.getPaymentStatus())) {
            throw new IllegalStateException("Stripe payment has not been completed.");
        }

        String clientReferenceId = session.getClientReferenceId();
        if (clientReferenceId == null || clientReferenceId.isBlank()) {
            throw new IllegalStateException("User information is missing from Stripe session.");
        }

        Long userId = Long.valueOf(clientReferenceId);
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        BigDecimal totalAmount = BigDecimal.valueOf(session.getAmountTotal()).movePointLeft(2);

        OrderEntity order = new OrderEntity(
                user,
                sessionId,
                totalAmount,
                "PAID"
        );

        order = orderRepository.save(order);

        List<CartItemEntity> cartItems = cartItemRepository.findByUserId(userId);

        for (CartItemEntity cartItem : cartItems) {
            OrderItemEntity orderItem = new OrderItemEntity(
                    order,
                    cartItem.getProduct(),
                    cartItem.getQuantity(),
                    cartItem.getProduct().getPrice()
            );
            orderItemRepository.save(orderItem);
        }

        cartItemRepository.deleteByUserId(userId);

        return order;
    }
}
