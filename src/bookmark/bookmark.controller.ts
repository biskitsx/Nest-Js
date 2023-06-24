import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from '../auth/guard/index';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private BookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.BookmarkService.getBookmarks(userId);
  }

  @Get('/:id')
  getBookmarksById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.BookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Post()
  postBookmarks(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
    return this.BookmarkService.createBookmark(userId, dto);
  }

  @Patch('/:id')
  editBookmarks(
    @GetUser('id') userId: number,
    @Body() dto: EditBookmarkDto,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.BookmarkService.editBookmarkById(userId, dto, bookmarkId);
  }

  @Delete('/:id')
  deleteBookmarksById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.BookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
