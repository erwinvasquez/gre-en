"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

export interface IntersectionOptions {
  /**
   * Threshold value between 0 and 1 indicating what percentage of the target element
   * must be visible before triggering the intersection
   */
  threshold?: number

  /**
   * Root margin value similar to CSS margin, to grow or shrink the root element's
   * bounding box before computing intersections
   */
  rootMargin?: string

  /**
   * Whether the observer should only trigger once
   */
  once?: boolean

  /**
   * Whether the observer should reset when the element leaves the viewport
   */
  resetOnLeave?: boolean

  /**
   * Callback function that runs when an element enters the viewport
   */
  onIntersect?: (element: Element) => void

  /**
   * Callback function that runs when an element leaves the viewport
   */
  onLeave?: (element: Element) => void
}

/**
 * Core hook for Intersection Observer functionality
 * This is the base hook that powers both animations and active section detection
 */
export function useIntersectionObserver<T extends Element = HTMLElement>(
  elementOrElements: React.RefObject<T> | React.RefObject<T>[] | null = null,
  {
    threshold = 0.1,
    rootMargin = "0px",
    once = false,
    resetOnLeave = false,
    onIntersect,
    onLeave,
  }: IntersectionOptions = {},
) {
  const [intersectingElements, setIntersectingElements] = useState<Set<Element>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementsRef = useRef<Set<Element>>(new Set())
  const hasTriggeredRef = useRef<Set<Element>>(new Set())

  // Setup and cleanup the observer
  useEffect(() => {
    // Create the observer instance
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Process each entry
        entries.forEach((entry) => {
          const element = entry.target

          if (entry.isIntersecting) {
            // Element is now visible
            if (once && hasTriggeredRef.current.has(element)) {
              return // Skip if we only trigger once and already triggered
            }

            // Update state with the intersecting element
            setIntersectingElements((prev) => {
              const updated = new Set(prev)
              updated.add(element)
              return updated
            })

            // Mark as triggered if using once option
            if (once) {
              hasTriggeredRef.current.add(element)
            }

            // Call the onIntersect callback if provided
            if (onIntersect) {
              onIntersect(element)
            }
          } else if (resetOnLeave) {
            // Element is no longer visible
            setIntersectingElements((prev) => {
              const updated = new Set(prev)
              updated.delete(element)
              return updated
            })

            // Call the onLeave callback if provided
            if (onLeave) {
              onLeave(element)
            }
          }
        })
      },
      {
        threshold,
        rootMargin,
      },
    )

    // Start observing elements
    const observer = observerRef.current
    const currentElements = elementsRef.current

    return () => {
      // Cleanup: disconnect the observer
      if (observer) {
        observer.disconnect()
      }
    }
  }, [threshold, rootMargin, once, resetOnLeave, onIntersect, onLeave])

  // Function to observe a single element
  const observeElement = (element: Element | null) => {
    if (!element || !observerRef.current) return

    // Add to our tracked elements
    elementsRef.current.add(element)

    // Start observing
    observerRef.current.observe(element)
  }

  // Function to unobserve a single element
  const unobserveElement = (element: Element | null) => {
    if (!element || !observerRef.current) return

    // Remove from our tracked elements
    elementsRef.current.delete(element)

    // Stop observing
    observerRef.current.unobserve(element)
  }

  // Observe elements when they change
  useEffect(() => {
    if (!elementOrElements) return

    // Handle single ref
    if (!Array.isArray(elementOrElements)) {
      const element = elementOrElements.current
      if (element) {
        observeElement(element)
      }
      return () => {
        if (element) {
          unobserveElement(element)
        }
      }
    }

    // Handle array of refs
    const elements = elementOrElements.map((ref) => ref.current).filter((el): el is T => el !== null)

    elements.forEach(observeElement)

    return () => {
      elements.forEach(unobserveElement)
    }
  }, [elementOrElements])

  // Function to check if an element is intersecting
  const isIntersecting = (element: Element | null) => {
    return element ? intersectingElements.has(element) : false
  }

  return {
    intersectingElements,
    isIntersecting,
    observeElement,
    unobserveElement,
  }
}
