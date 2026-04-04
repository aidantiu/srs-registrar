"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteTeacherDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  teacherName: string
  teacherId: string
  onSuccess: (id: string) => void
  onError: (error: string) => void
}

export function DeleteTeacherDialog({
  isOpen,
  onOpenChange,
  teacherName,
  teacherId,
  onSuccess,
  onError,
}: DeleteTeacherDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/teachers/${teacherId}`, {
        method: 'DELETE',
      })

      const body = (await response.json().catch(() => ({}))) as {
        error?: string
      }

      if (!response.ok) {
        onError(body.error ?? 'Failed to delete teacher.')
        return
      }

      onSuccess(teacherId)
      onOpenChange(false)
    } catch {
      onError('Something went wrong while deleting teacher.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Teacher</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{teacherName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
