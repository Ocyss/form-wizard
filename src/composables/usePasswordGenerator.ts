export interface PasswordOption {
  label: string
  value: string
}

export const PASSWORD_CHARSETS = {
  numbers: { label: '0-9', value: '0123456789' },
  uppercase: { label: 'A-Z', value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  lowercase: { label: 'a-z', value: 'abcdefghijklmnopqrstuvwxyz' },
  special: { label: '!@#.^&*', value: '!@#.^&*' },
} as const

export type PasswordOptions = {
  [key in keyof typeof PASSWORD_CHARSETS]: boolean

} & { length: number }

export function usePasswordGenerator() {
  function generatePassword(options: PasswordOptions): string {
    const { length, ...rest } = options

    const charsets: string[] = []
    Object.entries(rest).forEach(([key, value]) => {
      if (value)
        charsets.push(PASSWORD_CHARSETS[key as keyof typeof PASSWORD_CHARSETS].value)
    })
    // 如果没有选择任何字符集，默认使用小写字母
    if (charsets.length === 0) {
      charsets.push(PASSWORD_CHARSETS.lowercase.value)
    }

    // 合并所有字符集
    const allChars = charsets.join('')

    // 生成密码
    let password = ''

    // 确保密码包含每种选择的字符集中的至少一个字符
    const requiredChars: string[] = []
    Object.entries(rest).forEach(([key, value]) => {
      if (value)
        requiredChars.push(getRandomChar(PASSWORD_CHARSETS[key as keyof typeof PASSWORD_CHARSETS].value))
    })

    // 将必需字符随机插入密码
    for (let i = 0; i < length; i++) {
      password += getRandomChar(allChars)
    }

    // 如果密码长度足够，确保包含所有必需字符
    if (requiredChars.length > 0 && length >= requiredChars.length) {
      // 替换密码中的一些字符为必需字符
      const positions = getRandomPositions(length, requiredChars.length)

      for (let i = 0; i < requiredChars.length; i++) {
        password = replaceAt(password, positions[i], requiredChars[i])
      }
    }

    return password
  }

  // 从字符集中随机选择一个字符
  function getRandomChar(charset: string): string {
    const randomIndex = Math.floor(Math.random() * charset.length)
    return charset[randomIndex]
  }

  // 获取不重复的随机位置
  function getRandomPositions(max: number, count: number): number[] {
    const positions: number[] = []
    while (positions.length < count) {
      const pos = Math.floor(Math.random() * max)
      if (!positions.includes(pos)) {
        positions.push(pos)
      }
    }
    return positions
  }

  // 替换字符串中指定位置的字符
  function replaceAt(str: string, index: number, replacement: string): string {
    return str.substring(0, index) + replacement + str.substring(index + 1)
  }

  return {
    generatePassword,
    PASSWORD_CHARSETS,
  }
}
