"use client"

import { Edit2, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { TeacherModal } from "./teacher-modal"
import { DeleteTeacherDialog } from "./delete-teacher-dialog"

interface TeacherRow {
  id: string
  name: string
  department: string
  joining_date: string
  gender: string
  email: string
  is_active: boolean
}

interface TeacherPagination {
  page: number
  page_size: number
  total: number
  total_pages: number
}

interface TeachersTableProps {
  teachers: TeacherRow[]
  pagination: TeacherPagination
  title?: string
}

interface StatusMessage {
  type: 'success' | 'error'
  text: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return dateValue
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function TeachersTable({ teachers, pagination, title }: TeachersTableProps) {
  const [teacherRows, setTeacherRows] = useState<TeacherRow[]>(teachers)
  const [paginationState, setPaginationState] = useState<TeacherPagination>(pagination)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Modal states
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false)
  const [teacherModalMode, setTeacherModalMode] = useState<'add' | 'edit'>('add')
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRow | undefined>(undefined)
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherRow | null>(null)

  const startIndex = paginationState.total > 0
    ? (paginationState.page - 1) * paginationState.page_size + 1
    : 0
  const endIndex = teacherRows.length > 0 ? startIndex + teacherRows.length - 1 : 0

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > paginationState.total_pages || newPage === paginationState.page || isLoading) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/teachers?page=${newPage}&page_size=${paginationState.page_size}`)
      const body = await response.json() as { data: TeacherRow[], pagination: TeacherPagination }
      
      if (response.ok && body.data) {
        setTeacherRows(body.data)
        setPaginationState(body.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch teachers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPageNumbers = () => {
    const totalPages = paginationState.total_pages
    const currentPage = paginationState.page
    const pageNumbers: (number | string)[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)
      if (currentPage > 3) {
        pageNumbers.push('ellipsis-start')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push('ellipsis-end')
      }
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  function openAddTeacher() {
    setTeacherModalMode('add')
    setSelectedTeacher(undefined)
    setIsTeacherModalOpen(true)
  }

  function openEditTeacher(teacher: TeacherRow) {
    setTeacherModalMode('edit')
    setSelectedTeacher(teacher)
    setIsTeacherModalOpen(true)
  }

  function openDeleteTeacher(teacher: TeacherRow) {
    setTeacherToDelete(teacher)
    setIsDeleteOpen(true)
  }

  const handleTeacherSuccess = (returnedTeacher: any) => {
    if (teacherModalMode === 'add') {
      setTeacherRows((previous) => [returnedTeacher, ...previous].slice(0, paginationState.page_size))
      setPaginationState((previous) => {
        const total = previous.total + 1
        return {
          ...previous,
          total,
          total_pages: total > 0 ? Math.ceil(total / previous.page_size) : 0,
        }
      })
      setStatusMessage({ type: 'success', text: 'Teacher added successfully.' })
    } else {
      setTeacherRows((previous) => previous.map((teacher) => (
        teacher.id === returnedTeacher.id ? returnedTeacher : teacher
      )))
      setStatusMessage({ type: 'success', text: 'Teacher updated successfully.' })
    }
  }

  const handleDeleteSuccess = (id: string) => {
    setTeacherRows((previous) => previous.filter((row) => row.id !== id))
    setPaginationState((previous) => {
      const total = Math.max(previous.total - 1, 0)
      return {
        ...previous,
        total,
        total_pages: total > 0 ? Math.ceil(total / previous.page_size) : 0,
      }
    })
    setStatusMessage({ type: 'success', text: 'Teacher deleted successfully.' })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        {title && <h2 className="text-xl font-bold text-[#171717]">{title}</h2>}
        <Button onClick={openAddTeacher} className="bg-[#00754a] hover:bg-[#01653f] text-white">
          <Plus className="h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      {statusMessage && (
        <div
          className={statusMessage.type === 'success'
            ? 'rounded-md border border-[#d4e9e2] bg-[#f0fdf7] px-4 py-3 text-sm text-[#0f5132]'
            : 'rounded-md border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b]'}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden shadow-sm relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00754a]"></div>
          </div>
        )}
        <Table>
          <TableHeader className="bg-[#f9fafb]">
            <TableRow className="border-[#e5e7eb] hover:bg-transparent">
              <TableHead className="font-bold text-[#171717] h-14 px-6 text-sm">Teacher Name</TableHead>
              <TableHead className="font-bold text-[#171717] px-6 text-sm">Department</TableHead>
              <TableHead className="font-bold text-[#171717] px-6 text-sm">Joining Date</TableHead>
              <TableHead className="font-bold text-[#171717] px-6 text-sm">Gender</TableHead>
              <TableHead className="font-bold text-[#171717] px-6 text-sm">Email</TableHead>
              <TableHead className="text-right font-bold text-[#171717] px-6 text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teacherRows.length > 0 ? (
              teacherRows.map((teacher) => (
                <TableRow key={teacher.id} className="border-[#e5e7eb] hover:bg-[#f9fafb]/50 transition-colors">
                  <TableCell className="font-medium text-[#171717] py-4 px-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={teacher.name} />
                        <AvatarFallback className="bg-[#d4e9e2] text-[#00754a] text-xs font-bold">
                          {getInitials(teacher.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{teacher.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#6b7280] py-4 px-6 text-sm">{teacher.department}</TableCell>
                  <TableCell className="text-[#6b7280] py-4 px-6 text-sm">{formatDate(teacher.joining_date)}</TableCell>
                  <TableCell className="text-[#6b7280] py-4 px-6 text-sm">{teacher.gender}</TableCell>
                  <TableCell className="text-[#6b7280] py-4 px-6 text-sm">{teacher.email}</TableCell>
                  <TableCell className="text-right py-4 px-6">
                    <div className="flex items-center justify-end gap-3 text-[#6b7280]">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:text-[#00754a] hover:bg-[#d4e9e2]/50"
                        onClick={() => openEditTeacher(teacher)}
                        title={`Edit ${teacher.name}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:text-red-600 hover:bg-red-50"
                        onClick={() => openDeleteTeacher(teacher)}
                        title={`Delete ${teacher.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-sm text-[#6b7280]">
                  No teacher records yet. Run `pnpm db:seed` to load test data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
        <div className="text-sm text-[#6b7280] font-medium">
          Showing {startIndex}-{endIndex} of {paginationState.total}
        </div>
        <Pagination className="justify-end w-auto mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(paginationState.page - 1)
                }}
                className={paginationState.page === 1 ? "pointer-events-none opacity-50" : "text-[#6b7280] hover:text-[#171717] hover:bg-transparent cursor-pointer"} 
              />
            </PaginationItem>
            {getPageNumbers().map((page, index) => {
              if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              const pageNum = page as number
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(pageNum)
                    }}
                    isActive={paginationState.page === pageNum}
                    className={paginationState.page === pageNum
                      ? "bg-[#6b21a8] text-white hover:bg-[#581c87] border-transparent rounded-lg cursor-pointer"
                      : "text-[#6b7280] hover:bg-transparent cursor-pointer"}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(paginationState.page + 1)
                }}
                className={paginationState.page === paginationState.total_pages ? "pointer-events-none opacity-50" : "text-[#6b7280] hover:text-[#171717] hover:bg-transparent cursor-pointer"} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <TeacherModal
        isOpen={isTeacherModalOpen}
        onOpenChange={setIsTeacherModalOpen}
        mode={teacherModalMode}
        teacherData={selectedTeacher}
        onSuccess={handleTeacherSuccess}
      />

      {teacherToDelete && (
        <DeleteTeacherDialog
          isOpen={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          teacherId={teacherToDelete.id}
          teacherName={teacherToDelete.name}
          onSuccess={handleDeleteSuccess}
          onError={(error) => setStatusMessage({ type: 'error', text: error })}
        />
      )}
    </div>
  )
}
