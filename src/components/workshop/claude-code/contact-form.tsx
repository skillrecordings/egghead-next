'use client'

import type React from 'react'

import {useState} from 'react'
import {Button} from '@/ui/button'
import {Input} from '@/ui/input'
import {Label} from '@/ui/label'
import {Textarea} from '@/ui/textarea'
import toast from 'react-hot-toast'
import {CheckIcon, Loader2} from 'lucide-react'
import {getAuthorizationHeader} from '@/utils/auth'
import {cn} from '@/ui/utils'

export function ContactForm({
  className,
  teamWorkshopFeatures,
}: {
  className?: string
  teamWorkshopFeatures?: string[]
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    seats: '',
    additionalInfo: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {name, value} = e.target
    setFormData((prev) => ({...prev, [name]: value}))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await fetch('/api/workshop-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthorizationHeader(),
        },
        body: JSON.stringify({
          email: formData.email,
          seats: parseInt(formData.seats),
          additionalInfo: formData.additionalInfo,
          productTitle: 'Claude Code Team Workshop',
        }),
      })

      toast.success(
        "Request submitted successfully! We'll be in touch with you shortly.",
      )

      // Reset form
      setFormData({
        email: '',
        seats: '',
        additionalInfo: '',
      })
    } catch (error) {
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn('max-w-lg sm:mx-auto mx-4', className)}>
      <h3 className="text-2xl font-bold text-center mt-4">
        Transform into a Claude Code Power User
      </h3>
      {teamWorkshopFeatures && (
        <div className="mb-6">
          <h3 className="font-medium mb-3">Features</h3>
          <ul className="space-y-2">
            {teamWorkshopFeatures.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col gap-4 justify-center h-full"
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-white dark:bg-gray-900  border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seats" className="text-gray-700 dark:text-gray-300">
            Number of seats requested
          </Label>
          <Input
            id="seats"
            name="seats"
            type="number"
            min="10"
            placeholder="10"
            value={formData.seats}
            onChange={handleChange}
            required
            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="additionalInfo"
            className="text-gray-700 dark:text-gray-300"
          >
            Additional information
          </Label>
          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            placeholder="Tell us about your team, preferred dates, or any specific areas of interest..."
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={4}
            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
          />
        </div>

        <Button
          type="submit"
          className="relative inline-flex items-center justify-center rounded-md text-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4 w-full bg-blue-500 text-white font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Contact Us'
          )}
        </Button>
      </form>
    </div>
  )
}
