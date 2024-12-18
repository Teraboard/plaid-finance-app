package teraboard.org.plaidapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
public class PlaidFinanceAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlaidFinanceAppApplication.class, args);
    }

}
