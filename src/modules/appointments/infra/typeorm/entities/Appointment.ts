import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/Users';

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: String;

  @Column()
  provider_id: String;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider?: User;

  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  create_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}

export default Appointment;
