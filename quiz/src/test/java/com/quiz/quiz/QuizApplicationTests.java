package com.quiz.quiz;

import com.quiz.quiz.Config.FirebaseConfig;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ContextConfiguration;

@SpringBootTest
@ContextConfiguration(classes = {QuizApplicationTests.TestConfig.class})
public class QuizApplicationTests {

	@Configuration
	static class TestConfig {
		@Bean
		@Primary
		public FirebaseConfig firebaseConfig() {
			return org.mockito.Mockito.mock(FirebaseConfig.class);
		}
	}

	@Test
	void contextLoads() {
		// Test du chargement du contexte
	}
}