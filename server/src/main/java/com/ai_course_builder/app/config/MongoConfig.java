package com.ai_course_builder.app.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.CompoundIndexDefinition;
import org.springframework.data.mongodb.core.index.Index;

@Configuration
public class MongoConfig {

    @Bean
    public ApplicationRunner createIndexes(MongoTemplate mongoTemplate){
        return args -> {
            mongoTemplate.indexOps("courses")
                    .createIndex(new Index().on("normalizedTopic", Sort.Direction.ASC).unique());

            mongoTemplate.indexOps("quiz_attempts").createIndex(new CompoundIndexDefinition(new org.bson.Document("sessionId",1).append("lessonId", 1)));

            mongoTemplate.indexOps("lessons")
                    .createIndex(new Index().on("courseId", Sort.Direction.ASC));

            mongoTemplate.indexOps("practice_questions")
                    .createIndex(new Index().on("lessonId", Sort.Direction.ASC).unique());
        };
    }
}
