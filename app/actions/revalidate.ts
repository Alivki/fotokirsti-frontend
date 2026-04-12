"use server"

import { updateTag } from "next/cache"

/**
 * Bust the public gallery ISR cache. Called from admin client mutations
 * after publishing/unpublishing/deleting/editing photos so visitors see
 * changes immediately instead of waiting for the next revalidate window.
 */
export async function revalidateGallery() {
  updateTag("gallery")
}

export async function revalidatePricelist() {
  updateTag("pricelist")
}
