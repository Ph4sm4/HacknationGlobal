import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({
    name: "gov_domains"
})

export class GovDomainEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;
}