import { NextRequest, NextResponse } from 'next/server'

const BLOCKCHAIN_URL = 'http://127.0.0.1:8080'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const fullPath = path.join('/')
  const searchParams = request.nextUrl.searchParams.toString()
  const url = `${BLOCKCHAIN_URL}/${fullPath}${searchParams ? `?${searchParams}` : ''}`

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Blockchain API error' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Blockchain API proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to blockchain' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const fullPath = path.join('/')
  const body = await request.json()
  const url = `${BLOCKCHAIN_URL}/${fullPath}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Blockchain API error' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Blockchain API proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to blockchain' },
      { status: 500 }
    )
  }
}
