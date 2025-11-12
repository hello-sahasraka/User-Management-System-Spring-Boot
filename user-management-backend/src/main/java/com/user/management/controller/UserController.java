package com.user.management.controller;

import com.user.management.dto.UserDTO;
import com.user.management.repo.UserRepo;
import com.user.management.service.EmailService;
import com.user.management.service.MinioService;
import com.user.management.service.UserService;
import com.user.management.utils.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mail.MailSendException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URL;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value="api/v1")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private MinioService minioService;

    @GetMapping("/getusers")
    public List<UserDTO> getUser() {
        return userService.getAllUsers();
    }

    @GetMapping("/admin/getuserbyid/{userId}")
    public UserDTO getUserById(@PathVariable Integer userId) {
        return userService.getUserById(userId);
    }

    @PostMapping(
            value = "/admin/createuser",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public UserDTO createUser(
            @RequestPart("user") UserDTO userDTO,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        String password = PasswordGenerator.generateSecurePassword(12);
        userDTO.setPassword(password);

        if (image != null && !image.isEmpty()) {
            System.out.println("Image received: " + image.getOriginalFilename());

            try {
                userDTO.setImage(minioService.upload(image));
            } catch (Exception e) {
                System.out.println(e);
                throw new RuntimeException("Image upload failed: " + e.getMessage(), e);
            }
        }

        UserDTO createdUser = userService.createUser(userDTO);

        try {
            emailService.sendSimpleMail(userDTO.getEmail(), userDTO.getPassword());
        } catch (Exception e) {
            System.out.println(e);
            throw new MailSendException("Failed to send verification email", e);
        }

        return createdUser;
    }

    @PutMapping(
            value = "/admin/updateuser",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public UserDTO updateUser(
            @RequestPart("user") UserDTO userDTO,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        UserDTO currentData = userService.getUserById(userDTO.getId());

        if (currentData == null) {
            throw new RuntimeException("User not found with id: " + userDTO.getId());
        }

        userDTO.setPassword(currentData.getPassword());

        if (image == null || image.isEmpty()) {
            userDTO.setImage(currentData.getImage());
        } else {
            System.out.println("Image received: " + image.getOriginalFilename());
            try {
                String newImageUrl = minioService.upload(image);
                userDTO.setImage(newImageUrl);

                if (currentData.getImage() != null && !currentData.getImage().isEmpty()) {
                    try {
                        URL imageUrl = new URL(currentData.getImage());
                        String path = imageUrl.getPath();
                        String imageName = path.substring(path.lastIndexOf("/") + 1);

                        minioService.delete(imageName);
                        System.out.println("Old image deleted successfully: " + imageName);
                    } catch (Exception e) {
                        System.out.println("Old image not deleted: " + e.getMessage());
                    }
                }

            } catch (Exception e) {
                System.out.println("Image upload failed: " + e.getMessage());
                throw new RuntimeException("Image upload failed: " + e.getMessage(), e);
            }
        }

        return userService.updateUser(userDTO);
    }


    @DeleteMapping("/admin/deleteuser/{userId}")
    public String deleteUser(@PathVariable int userId) { return userService.deleteUser(userId); }
}
