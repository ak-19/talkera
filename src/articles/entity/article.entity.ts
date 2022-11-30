import { User } from "src/users/entity/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "articles" })
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @Column()
    title: string;

    @Column({ default: '' })
    description: string;

    @Column({ default: '' })
    body: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    creatdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updateAt: Date;

    @Column('simple-array')
    tagList: string[];

    @Column({ default: 0 })
    favoritesCount: number;

    @BeforeUpdate()
    updateTimeStamp() {
        this.updateAt = new Date();
    }

    @ManyToOne(() => User, (user) => user.articles, { eager: true })
    author: User;
}