import { NextRequest, NextResponse } from 'next/server';
import { getSubmissions, getSubmissionCount, deleteSubmission } from '@/lib/redis';

function isAuthorized(_request: NextRequest): boolean {
  // Auth disabled — public access
  return true;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const [submissions, total] = await Promise.all([
      getSubmissions(limit, offset),
      getSubmissionCount(),
    ]);

    return NextResponse.json({ submissions, total });
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
  }

  try {
    await deleteSubmission(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}
