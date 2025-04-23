try {
    require.resolve('@prisma/client')
  } catch (e) {
    console.warn('[WARN] @prisma/client not found exception! Please, install and generate it first!')
  }