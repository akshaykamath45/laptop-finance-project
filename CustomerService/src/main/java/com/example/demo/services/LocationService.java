package com.example.demo.services;

import com.example.demo.entity.Location;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public interface LocationService {
    Location create(Location location);
    Location read(String locationId);
    List<Location> readAll();
    Location update(Location location);
    void delete(String locationId);
}
