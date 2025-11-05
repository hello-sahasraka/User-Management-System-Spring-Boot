package com.user.management.service;

import com.user.management.dto.UserDTO;
import com.user.management.model.UserModel;
import com.user.management.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.modelmapper.internal.bytebuddy.description.method.MethodDescription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional

public class UserService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ModelMapper modelMapper;

    public List<UserDTO> getAllUsers() {
        List<UserModel> userModelList  =userRepo.findAll();
        return modelMapper.map(userModelList, new TypeToken<List<UserDTO>>(){}.getType());
    }

    public UserDTO createUser(UserDTO userDTO) {
        UserModel savedUser = userRepo.save(modelMapper.map(userDTO, UserModel.class));
        return modelMapper.map(savedUser, UserDTO.class);
    }

    public UserDTO updateUser(UserDTO userDTO) {
        UserModel savedUser = userRepo.save(modelMapper.map(userDTO, UserModel.class));
        return modelMapper.map(savedUser, UserDTO.class);
    }
}
