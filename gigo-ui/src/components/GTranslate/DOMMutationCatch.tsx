'use client'

import { useEffect } from 'react'

export default function DOMMutationCatch() {
  useEffect(() => {
    if (typeof Node === 'function' && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      // @ts-ignore
      Node.prototype.removeChild = function (child) {
        if (child.parentNode !== this) {
          if (console) {
            console.error('Cannot remove a child from a different parent', child, this);
          }
          return child;
        }
        // @ts-ignore
        return originalRemoveChild.apply(this, arguments);
      }

      const originalInsertBefore = Node.prototype.insertBefore;
      // @ts-ignore
      Node.prototype.insertBefore = function (newNode, referenceNode) {
        if (referenceNode && referenceNode.parentNode !== this) {
          if (console) {
            console.error('Cannot insert before a reference node from a different parent', referenceNode, this);
          }
          return newNode;
        }
        // @ts-ignore
        return originalInsertBefore.apply(this, arguments);
      }
    }
  }, [])

  return null
}