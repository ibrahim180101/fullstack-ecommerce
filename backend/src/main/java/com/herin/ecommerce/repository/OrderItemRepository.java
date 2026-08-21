package com.herin.ecommerce.repository;

import com.herin.ecommerce.model.OrderEntity;
import com.herin.ecommerce.model.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {

    List<OrderItemEntity> findByOrder(OrderEntity order);
}
