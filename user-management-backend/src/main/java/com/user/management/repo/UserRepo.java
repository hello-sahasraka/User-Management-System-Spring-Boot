package com.user.management.repo;

import com.user.management.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<UserModel, Integer> {
    @Query(value = "SELECT * FROM user_model WHERE id = ?1", nativeQuery = true)
    UserModel getUserById(Integer userId);

    @Query(value = "SELECT * FROM user_model WHERE name = :name", nativeQuery = true)
    UserModel getUserByName(@Param("name") String name);
}
