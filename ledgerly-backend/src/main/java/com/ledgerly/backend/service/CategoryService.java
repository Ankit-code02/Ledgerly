package com.ledgerly.backend.service;

import com.ledgerly.backend.dto.CategoryRequest;
import com.ledgerly.backend.dto.CategoryResponse;
import com.ledgerly.backend.entity.Category;
import com.ledgerly.backend.entity.User;
import com.ledgerly.backend.repository.CategoryRepository;
import com.ledgerly.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            UserRepository userRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CategoryResponse create(Long userId, CategoryRequest request) {

        if (categoryRepository.existsByNameAndUserId(
                request.getName(), userId)) {
            throw new IllegalArgumentException(
                    "Category already exists"
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        Category category = new Category();
        category.setName(request.getName());
        category.setUser(user);
        category.setCreatedAt(LocalDateTime.now());

        Category saved = categoryRepository.save(category);

        return new CategoryResponse(
                saved.getId(),
                saved.getName(),
                saved.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getByUser(Long userId) {

        return categoryRepository.findByUserId(userId)
                .stream()
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getCreatedAt()
                ))
                .toList();
    }
    @Transactional(readOnly = true)
    public CategoryResponse getById(Long id, Long userId) {

        Category category = categoryRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found")
                );

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getCreatedAt()
        );
    }

    @Transactional
    public CategoryResponse update(
            Long id,
            Long userId,
            CategoryRequest request
    ) {

        Category category = categoryRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found")
                );

        if (!category.getName().equals(request.getName())
                && categoryRepository.existsByNameAndUserId(
                request.getName(), userId)) {

            throw new IllegalArgumentException(
                    "Category already exists"
            );
        }

        category.setName(request.getName());

        Category saved = categoryRepository.save(category);

        return new CategoryResponse(
                saved.getId(),
                saved.getName(),
                saved.getCreatedAt()
        );
    }

    @Transactional
    public void delete(Long id, Long userId) {

        Category category = categoryRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found")
                );

        categoryRepository.delete(category);
    }
}