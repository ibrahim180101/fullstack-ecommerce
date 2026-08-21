package com.herin.ecommerce.repository;

import com.herin.ecommerce.model.OrderEntity;
import com.herin.ecommerce.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    List<OrderEntity> findByUser(UserEntity user);

    Optional<OrderEntity> findByStripeSessionId(String stripeSessionId);
}
