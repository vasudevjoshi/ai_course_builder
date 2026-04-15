package com.ai_course_builder.app.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatClientConfig {
    @Bean
    public ChatClient chatClient(ChatClient.Builder builder){
        return builder
                .defaultSystem("""
                        You are an expert curriculum designer and educator.
                                       You ALWAYS respond with valid JSON only.
                                       Never include markdown code blocks, explanations, or any text outside the JSON.
                                       Always follow the exact JSON structure requested.
                        """)
                .defaultAdvisors(new SimpleLoggerAdvisor())
                .build();
    }
}
