package com.user.management.service;

import com.user.management.dto.UserDTO;
import com.user.management.model.UserModel;
import com.user.management.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.modelmapper.internal.bytebuddy.description.method.MethodDescription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers() {
        List<UserModel> userModelList  =userRepo.findAll();
        return modelMapper.map(userModelList, new TypeToken<List<UserDTO>>(){}.getType());
    }

    public UserDTO getUserById(Integer id) {
        UserModel user = userRepo.getUserById(id);
        return modelMapper.map(user, UserDTO.class);
    }

//    public UserDTO getUserByName(String name) {
//        UserModel user = userRepo.getUserByName(name);
//
//        if (user == null) {
//            throw new UsernameNotFoundException("User not found: " + name);
//        }
//
//        return modelMapper.map(user, UserDTO.class);
//    }

    public UserDTO createUser(UserDTO userDTO) {

        UserModel userModel = modelMapper.map(userDTO, UserModel.class);

        // ensure default role
        if (userModel.getRole() == null || userModel.getRole().isBlank()) {
            userModel.setRole("USER");
        }

        String hashedPassword = passwordEncoder.encode(userModel.getPassword());
        userModel.setPassword(hashedPassword);

        UserModel savedUser = userRepo.save(userModel);
        return modelMapper.map(savedUser, UserDTO.class);
    }

    public UserDTO updateUser(UserDTO userDTO) {
        UserModel savedUser = userRepo.save(modelMapper.map(userDTO, UserModel.class));
        return modelMapper.map(savedUser, UserDTO.class);
    }

    public String deleteUser(int userId) {
        userRepo.deleteById(userId);
        return "User deleted successfully";
    }
}
