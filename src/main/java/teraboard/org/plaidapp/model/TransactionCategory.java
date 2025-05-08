package teraboard.org.plaidapp.model;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TransactionCategory {
    GROCERIES,
    UTILITIES,
    ENTERTAINMENT,
    TRANSPORTATION,
    DINING,
    SHOPPING,
    HEALTHCARE,
    HOUSING,
    INCOME,
    SAVINGS,
    OTHER,
    UNCATEGORIZED;

    // Convert string to enum regardless of case
    @JsonCreator
    public static TransactionCategory fromString(String value) {
        if (value == null || value.isEmpty()) {
            return UNCATEGORIZED;
        }

        try {
            // Try exact match first
            return TransactionCategory.valueOf(value);
        } catch (IllegalArgumentException e) {
            // Try case-insensitive match
            for (TransactionCategory category : TransactionCategory.values()) {
                if (category.name().equalsIgnoreCase(value)) {
                    return category;
                }
            }
            // Fallback to UNCATEGORIZED
            return UNCATEGORIZED;
        }
    }

    // Custom MongoDB converters for TransactionCategory
    @Component
    @ReadingConverter
    public static class StringToTransactionCategoryConverter implements Converter<String, TransactionCategory> {
        @Override
        public TransactionCategory convert(String source) {
            return TransactionCategory.fromString(source);
        }
    }

    @Component
    @WritingConverter
    public static class TransactionCategoryToStringConverter implements Converter<TransactionCategory, String> {
        @Override
        public String convert(TransactionCategory source) {
            return source.name();
        }
    }
}
