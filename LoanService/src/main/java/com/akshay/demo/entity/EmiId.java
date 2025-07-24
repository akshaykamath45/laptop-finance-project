package com.akshay.demo.entity;

import java.io.Serializable;
import java.util.Objects;

public class EmiId implements Serializable {
    private String loanId;
    private int emiNumber;

    public EmiId() {}

    public EmiId(String loanId, int emiNumber) {
        this.loanId = loanId;
        this.emiNumber = emiNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EmiId)) return false;
        EmiId that = (EmiId) o;
        return emiNumber == that.emiNumber && Objects.equals(loanId, that.loanId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(loanId, emiNumber);
    }
}