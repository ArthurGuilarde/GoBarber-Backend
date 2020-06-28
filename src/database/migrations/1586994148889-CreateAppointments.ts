import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAppointments1586994148889 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'appointments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'

          },
          {
            name: 'provider_id',
            type: 'uuid',
            isNullable: true,

          },
          {
            name: 'date',
            type: 'timestamp with time zone',
            isNullable: false,
          },
          {
            name: 'create_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          }
        ]
      })
    )

    await queryRunner.createForeignKey('appointments', new TableForeignKey({
      name: 'AppointmentProvider',
      columnNames: ['provider_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('users', 'AppointmentProvider')

    await queryRunner.dropTable('appointments')
  }

}
