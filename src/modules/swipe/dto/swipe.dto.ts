import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class SwipeDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    swipedId: string;

    @ApiProperty({ enum: ['like', 'pass'] })
    @IsNotEmpty()
    @IsIn(['like', 'pass'])
    action: 'like' | 'pass';
}
