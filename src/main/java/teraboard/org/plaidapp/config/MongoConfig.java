package teraboard.org.plaidapp.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import teraboard.org.plaidapp.model.TransactionCategory;

@Configuration
public class MongoConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(Arrays.asList(
            new TransactionCategory.StringToTransactionCategoryConverter(),
            new TransactionCategory.TransactionCategoryToStringConverter()
        ));
    }
}