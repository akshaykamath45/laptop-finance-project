package com.example.demo.services;

import com.example.demo.entity.Location;
import com.example.demo.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class LocationServiceImpl implements LocationService {

    @Autowired
    LocationRepository locationRepo;

    @Override
    public Location create(Location location) {
        if (locationRepo.existsById(location.getLocationId())) {
            throw new RuntimeException("Location already exists with ID: " + location.getLocationId());
        }
        return locationRepo.save(location);
    }

    @Override
    public Location read(String locationId) {
        return locationRepo.findById(locationId).orElseThrow(() -> new RuntimeException("Location not found: " + locationId));
    }

    @Override
    public List<Location> readAll() {
        return locationRepo.findAll();
    }

    @Override
    public Location update(Location location) {
        if (!locationRepo.existsById(location.getLocationId())) {
            throw new RuntimeException("Location not found: " + location.getLocationId());
        }
        return locationRepo.save(location);
    }

    @Override
    public void delete(String locationId) {
        if (!locationRepo.existsById(locationId)) {
            throw new RuntimeException("Location not found: " + locationId);
        }
        locationRepo.deleteById(locationId);
    }
}
